# Frontend

## Remark

Create a `.env` file in the `frontend/` directory and specify the `NEXT_PUBLIC_BACKEND_URL` environement variable in this file to specifiy on which host and port Node should run. The value defaults to `http://localhost:8081/` when not specified in said file.

## Installation

`yarn install` to install all necessary packages (requires the yarn package manager and NodeJS)

## Compilation for developer purposes

`yarn dev` to compile and run an instance of NextJS

## Compilation for production purposes

`yarn build` to compile the frontend for production  
`yarn start` to run the previously compiled files
