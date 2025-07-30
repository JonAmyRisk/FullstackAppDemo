export function Home() {
    return (
        <div>
            <h1>
                This is a simple example full stack application.
            </h1>
            <p>
                The front end allows a user to create and edit Accounts, then create and manage payments tied to those accounts.                
            </p>
            <p>
                Made by Jonathan
            </p>
            <div>
                Day 1: Initial project scaffold, end to end with Prisma controlled PostgreSQL and NestJS Backend
                Day 2: Added Functionality for CRU to linked backend tables, backend tests, setup JEST for frontend
                Day 3: All tests, added snackbar support for both current pages, added info panels minor QoL
                Day 4: Added automatic logging into notes via backend to track changes, swagger and i18Next for localization
                Day 5: Searches, Filters, Groups
                Day 6: Auth, Deletion for full CRUD, handling PostGreSQL orphaned data
                Day 7: Built secondary microservice for separate docker to handle WWW queries (exchange rates)
            </div>
        </div>
    )
}