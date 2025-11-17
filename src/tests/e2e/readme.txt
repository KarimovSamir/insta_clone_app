Для запуска всех тестов
pnpm test 

Запуск только определенного файла
pnpm test src/tests/e2e/blogs.e2e.test.ts

Для запуска конкретного теста в конкретном файл надо
добавить к нужному тесту describe.only('POST /blogs'...)
pnpm test src/tests/e2e/blogs.e2e.test.ts
ИЛИ
pnpm test -t="POST /blogs"
