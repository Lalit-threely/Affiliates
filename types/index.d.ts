export type EmailMessageType = 'invitation' | 'resetPassword';

export interface userData {
    id: UUIDTypes | null;
    name: string;
    email?: string;
    verified?: boolean;
}