import NotificationClient from '@hireverse/service-protos/dist/clients/notification-client';

export const notificationClient = NotificationClient(process.env.NOTIFICATION_SERVICE_URL!)