'use server';

export async function getProfile() { return {}; }
export async function updateProfile(data: any) { return { success: true }; }
export async function changePassword(oldPass: string, newPass: string) { return { success: true }; }
export async function getNotificationPreferences() { return {}; }
export async function updateNotificationPreferences(data: any) { return { success: true }; }
export async function getActiveSessions() { return []; }
export async function revokeSession(id: string) { return { success: true }; }
