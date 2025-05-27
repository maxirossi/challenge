import { DriverInterface } from "./DriverInterface";
export interface DriversInterface {
  success: boolean;
  message?: string;
  drivers?: DriverInterface[];
  data?: any;
}
