export type Schedule = {
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
}[];

export const initSchedule: Schedule = Array(8).fill({
  mon: "",
  tue: "",
  wed: "",
  thu: "",
  fri: "",
});

export const scheduleHeadings = ["mon", "tue", "wed", "thu", "fri"];
export type ScheduleHeadings = "mon" | "tue" | "wed" | "thu" | "fri";
