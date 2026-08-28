# 🌷 Flower Shop Web API & SPA

![.NET 10](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet)
![C# 14](https://img.shields.io/badge/C%23-14-239120?logo=csharp)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)
![EF Core](https://img.shields.io/badge/EF_Core-10.0-5C2D91?logo=nuget)
![Vanilla JS](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap)

Современное SPA-приложение коммерческого цветочного магазина. Проект демонстрирует строгую изоляцию слоев (Backend / Frontend), работу с реляционной БД и независимый учет остатков по нескольким филиалам (модель Click & Collect).

## Архитектура и Технологии

Проект построен по принципам **Layered Architecture** с полным разделением клиентской и серверной частей.

**Backend:**
* **Платформа:** .NET 10.0 / C# 14
* **СУБД:** PostgreSQL с подходом Code-First
* **ORM:** Entity Framework Core 10.0 (Npgsql)
* **Паттерны проектирования:** Dependency Injection (DI), Repository Pattern (изоляция логики доступа к данным от контроллеров)
* **API:** RESTful API с возвратом строго типизированных JSON-ответов (DTO)

**Frontend:**
* **Стек:** Чистый HTML5 + Vanilla JavaScript (ES6 Modules)
* **Сетевое взаимодействие:** Асинхронные запросы через Fetch API (async/await)
* **UI/UX:** Bootstrap 5.3 (управление через LibMan)
* **Особенности JS:** Использование паттерна делегирования событий (Event Delegation) для оптимизации работы с DOM, динамический рендеринг таблиц на основе шаблонных строк
* **Безопасность:** Кастомная утилита `escapeHtml` для предотвращения XSS-атак при выводе пользовательских данных

**База Данных**
* Взаимодействие компонентов выстроено с применением паттернов Dependency Injection и Repository, что изолирует логику доступа к данным от контроллеров.
```mermaid
graph TD
    Client[Client Browser / SPA] -->|Fetch API / JSON| Controller[API Controllers]
    Controller -->|DTOs| Services[Business Logic Services]
    Services -->|Domain Models| Repository[Repository Layer]
    Repository -->|EF Core 10| DB[(PostgreSQL)]
 ```

* Схема базы данных спроектирована с использованием таблицы-посредника Inventory для реализации связи «Многие-ко-многим» между товарами и филиалами.
```mermaid
erDiagram
    STORE ||--o{ INVENTORY : has
    FLOWER ||--o{ INVENTORY : stocked_in
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER }o--|| STORE : assigned_to
    FLOWER ||--o{ ORDER_ITEM : included_in
```

## Возможности

- чистая изоляция клиентской и серверной частей (Layered Architecture);
- полноценный RESTful API с возвратом строго типизированных JSON-ответов (DTO);
- клиентский рендеринг через Vanilla JS с использованием паттерна делегирования событий;
- защита от XSS-атак при динамическом выводе пользовательских данных;
- асинхронные операции создания, чтения, обновления и удаления (CRUD) без перезагрузки страницы;
- независимый учет остатков одного и того же товара в разных физических магазинах (Мульти-склад);
- разделение конфигураций на публичные и локальные для защиты секретов базы данных.

## Структура и состояние модулей

Проект находится в стадии активной разработки (MVP). На данный момент реализованы следующие базовые модули:

* **Модуль базы данных (Мульти-склад):** Спроектирована реляционная схема с использованием таблицы-посредника `Inventory`. Это позволяет вести независимый учет остатков одного и того же товара (букета) в разных физических магазинах (Store).
* **Модуль управления (Админ-панель):** Реализован полноценный клиентский интерфейс для управления ассортиментом. Поддерживаются асинхронные операции создания (POST), чтения (GET), обновления (PUT) и удаления (DELETE) товаров без перезагрузки страницы. Реализован маппинг данных сущности в форму редактирования.
* **Модуль витрины (Каталог):** Настроен эндпоинт выдачи DTO-объектов для клиентской части, агрегирующий данные о наличии товаров по филиалам с помощью сложных LINQ-запросов.

## Требования

- установленный .NET 10.0 SDK;
- локальный или удаленный сервер PostgreSQL;
- утилита LibMan для управления клиентскими библиотеками (Bootstrap);
- современный браузер с поддержкой ES6 Modules и Fetch API.

## Инструкция по локальному запуску

1. Склонируйте репозиторий на свой компьютер.
2. В корне проекта создайте файл `appsettings.Development.json` и добавьте вашу строку подключения к PostgreSQL:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=FlowerShopDb;Username=ВАШ_ЛОГИН;Password=ВАШ_ПАРОЛЬ"
     }
   }
   ```
3. Восстановите клиентские библиотеки (Bootstrap) через LibMan:
    ```bash 
    libman restore
    ```
4. Примените миграции для создания схемы базы данных:
    ```bash
    dotnet ef database update
    ```
5. Запустите проект:
    ```
    dotnet run
    ```
6. Откройте в браузере нужный раздел (глобальный редирект на стартовую страницу находится в разработке):
  * Панель администратора: `http://localhost:5012/admin/index.html`
  * Витрина магазина: `http://localhost:5012/catalog/index.html`