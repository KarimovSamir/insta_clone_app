// import { query } from 'express-validator';
// import { SortDirection } from '../../types/sort-direction';
// import { PaginationAndSorting } from '../../types/pagination-and-sorting';

// // Дефолтные значения
// const DEFAULT_PAGE_NUMBER = 1;
// const DEFAULT_PAGE_SIZE = 10;
// const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
// const DEFAULT_SORT_BY = 'createdAt';

// export const paginationAndSortingDefault: PaginationAndSorting<string> = {
//   pageNumber: DEFAULT_PAGE_NUMBER,
//   pageSize: DEFAULT_PAGE_SIZE,
//   sortBy: DEFAULT_SORT_BY,
//   sortDirection: DEFAULT_SORT_DIRECTION,
// };

// export function paginationAndSortingValidation<T extends string>(
//   sortFieldsEnum: Record<string, T>,
// ) {
//   const allowedSortFields = Object.values(sortFieldsEnum);

//   return [
//     query('pageNumber')
//       .optional({ values: 'falsy' })
//       .default(DEFAULT_PAGE_NUMBER)
//       .isInt({ min: 1 })
//       .withMessage('Page number must be a positive integer')
//       .toInt(),

//     query('pageSize')
//       .optional({ values: 'falsy' }) //чтобы default() применялся и для ''
//       .default(DEFAULT_PAGE_SIZE)
//       .isInt({ min: 1, max: 100 })
//       .withMessage('Page size must be between 1 and 100')
//       .toInt(),

//     query('sortBy')
//       .optional({ values: 'falsy' })
//       .default(Object.values(sortFieldsEnum)[0]) // Первое значение enum как дефолтное
//       .isIn(allowedSortFields)
//       .withMessage(
//         `Invalid sort field. Allowed values: ${allowedSortFields.join(', ')}`,
//       ),

//     query('sortDirection')
//       .optional({ values: 'falsy' })
//       .default(DEFAULT_SORT_DIRECTION)
//       .isIn(Object.values(SortDirection))
//       .withMessage(
//         `Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`,
//       ),
//   ];
// }


// .optional({ values: 'falsy' })
// Тут если values пустой, то default() уже не отработает. Поэтому ефолтные значения не применялись

import { query } from 'express-validator';
import { SortDirection } from '../../types/sort-direction';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc; // должен быть строковым enum: 'asc' | 'desc'
const DEFAULT_SORT_BY = 'createdAt';

export function paginationAndSortingValidation<T extends string>(
  sortFieldsEnum: Record<string, T>,
) {
  const allowedSortFields = Object.values(sortFieldsEnum); // лучше передавать как const-объект, не TS-enum

  return [
    query('pageNumber')
      .default(DEFAULT_PAGE_NUMBER)
      .toInt()
      .isInt({ min: 1 })
      .withMessage('Page number must be a positive integer'),

    query('pageSize')
      .default(DEFAULT_PAGE_SIZE)
      .toInt()
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100'),

    query('sortBy')
      .default(DEFAULT_SORT_BY) // явный стабильный дефолт
      .isIn(allowedSortFields)
      .withMessage(`Invalid sort field. Allowed values: ${allowedSortFields.join(', ')}`),

    query('sortDirection')
      .default(DEFAULT_SORT_DIRECTION)
      .isIn(Object.values(SortDirection))
      .withMessage(`Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`),
  ];
}
