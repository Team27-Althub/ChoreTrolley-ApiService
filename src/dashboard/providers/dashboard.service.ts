import { Injectable } from '@nestjs/common';
import { DashboardProvider } from './DashboardProvider';

@Injectable()
export class DashboardService {
  constructor(private readonly _dashboardProvider: DashboardProvider) {}

  async findCategoriesByLimit(limit: number = 6) {
    return this._dashboardProvider.findCategoriesByLimit(limit);
  }

  async findServicesByLimit(limit: number = 5) {
    return this._dashboardProvider.findServicesByLimit(limit);
  }

  async findServiceProvidersByLimit(limit: number = 5) {
    return this._dashboardProvider.findServiceProviderByLimit(limit);
  }
}
