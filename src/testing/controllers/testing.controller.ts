import { inject, injectable } from 'inversify';
import { RequestHandler } from 'express';
import { TYPES } from '../../core/ioc/types';
import { HttpStatus } from '../../core/types/http-statuses';
import { TestingService } from '../application/testing.service';

@injectable()
export class TestingController {
  constructor(
    @inject(TYPES.TestingService)
    private readonly testingService: TestingService,
  ) {}

  deleteAllData: RequestHandler = async (req, res) => {
    await this.testingService.deleteAllData();
    res.sendStatus(HttpStatus.NoContent);
  };
}
