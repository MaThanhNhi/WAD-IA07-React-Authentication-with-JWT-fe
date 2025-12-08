import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../lib/api';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { Session } from '../types/auth';

export const SessionManager = () => {
  const queryClient = useQueryClient();

  // Fetch active sessions
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => authApi.getSessions(),
  });

  // Revoke session mutation
  const revokeMutation = useMutation({
    mutationFn: (sessionId: string) => authApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });

  // Logout from all devices mutation
  const logoutAllMutation = useMutation({
    mutationFn: () => authApi.logoutAllDevices(),
    onSuccess: () => {
      window.location.href = '/login';
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getBrowserName = (userAgent?: string) => {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown Browser';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Loading your active sessions...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          Manage your active sessions across different devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions && sessions.length > 0 ? (
            <>
              {sessions.map((session: Session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {getBrowserName(session.userAgent)}
                      </span>
                      {session.ipAddress && (
                        <span className="text-sm text-gray-500">
                          {session.ipAddress}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <div>Created: {formatDate(session.createdAt)}</div>
                      <div>Last used: {formatDate(session.lastUsedAt)}</div>
                      <div>Expires: {formatDate(session.expiresAt)}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeMutation.mutate(session.id)}
                    disabled={revokeMutation.isPending}
                  >
                    Revoke
                  </Button>
                </div>
              ))}

              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => logoutAllMutation.mutate()}
                  disabled={logoutAllMutation.isPending}
                  className="w-full"
                >
                  Logout from All Devices
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No active sessions found
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
