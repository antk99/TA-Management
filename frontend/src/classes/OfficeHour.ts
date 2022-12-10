export const OFFICE_HOURS_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const OFFICE_HOURS_HOURS = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];
export type Day = typeof OFFICE_HOURS_DAYS[number];
export type Hour = typeof OFFICE_HOURS_HOURS[number];

export interface OfficeHour {
    day: Day;
    periodicity: 'weekly' | 'biweekly';
    startTime: Hour;
    endTime: Hour;
    location: string;
}
  