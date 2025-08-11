## MAIIA - Backend Technical Test

## Pre-Requisites
- <span style="color:orange">Java 11</span>
- Gradle
- npm/yarn

## Backend
The backend is a SpringBoot project using `Gradle`. You can open it in your favorite IDE and run it as a SpringBoot app through <span style="color:orange">Java 11</span>.

You can also run it through your CLI

You can run the app with the following command
```bash
./gradlew bootRun
```

If you want to run unit tests in CLI : 

```bash
./gradlew test
```

## Frontend
First, you need to `cd` into the right folder

```bash
cd ./client
```

Then install the project dependencies:

```bash
yarn install
```

Finally you can run the development server:

<span style="color:orange">&nbsp;&nbsp;For Linux and Mac users:</span>

```bash
yarn dev
```

<span style="color:orange">&nbsp;&nbsp;For Windows users:</span>

```bash
yarn dev-windows
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see instructions for the technical test.
By default, all API calls will be redirected to http://localhost:8080

You should consider this technical test a TDD exercise, <span style="color:orange">hence the existing tests should not be modified</span> (but feel free to add new/more test cases).

## Editor

The instructions work best with Visual Studio Code which provides an API to open local files directly from the browser by clicking a link.

If you favor another text editor providing a similar API feel free to modify `src/components/EditorLink.tsx` to suit your needs.
