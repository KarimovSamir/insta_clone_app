import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/ioc/types';
import { TestingRepository } from '../repositories/testing.repository';

@injectable()
export class TestingService {
  constructor(
    @inject(TYPES.TestingRepository)
    private readonly testingRepository: TestingRepository,
  ) {}

  async deleteAllData(): Promise<void> {
    await this.testingRepository.deleteAllData();
  }
}
