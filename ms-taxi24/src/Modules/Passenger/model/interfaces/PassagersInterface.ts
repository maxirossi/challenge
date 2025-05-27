import { PassengerInterface } from './PassagerInterface';

export interface PassengersInterface {
  success: boolean;
  message?: string;
  passengers?: PassengerInterface[];
  data?: any;
}