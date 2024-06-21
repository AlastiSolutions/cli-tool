#!/usr/bin/env node

import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import gradient from "gradient-string";
// import chalkAnimation from "chalk-animation"

import { execSync } from "child_process";
import { createSpinner } from "nanospinner";

let PROJECT_NAME: string = "";

const sleep = (ms: number = 3000) => new Promise((r) => setTimeout(r, ms));

/**
 * Function to display a welcome message and instructions to the user.
 * It uses figlet and gradient-string libraries to create a stylized title.
 * It then prints a welcome message, instructions, and warnings to the console.
 *
 * @returns {Promise<void>} - The function does not return anything.
 *
 * @throws Will throw an error if figlet or gradient-string libraries are not installed.
 */
async function welcome() {
  const title = "AlastiSolutions CLI Tool!";

  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();

  console.log(`
    ${chalk.blueBright("WHAT TO DO")}
    I am a CLI tool for AlastiSolutions.

    ${chalk.bold("Currently having issues with next js. Apologies!")}

    If you press CTRL + C, I will be ${chalk.redBright("exited")}

    ${chalk.bgRed("Don't run this tool in a production environment.")}

    Let's start!
    `);
}

/**
 * Function to get the project name from the user.
 * It uses inquirer to prompt the user for the project name.
 * If the user does not provide a name, it defaults to "my-project".
 * The project name is then stored in the PROJECT_NAME variable.
 *
 * @returns {Promise<void>} - The function does not return anything.
 */
async function getProjectName(): Promise<void> {
  const answers = await inquirer.prompt({
    name: "project_name",
    type: "input",
    message: "What is the name of your project?\n",
    default() {
      return "my-project";
    },
  });

  // Store the global project name in the PROJECT_NAME variable
  PROJECT_NAME = answers.project_name;
}

/**
 * Function to get the project type from the user.
 * It uses inquirer to prompt the user for the project type.
 * The choices are "react-vite" and "next".
 *
 * @returns {Promise<void>} - The function does not return anything.
 * It calls the handleAnswer function with the selected project type.
 */
async function getProjectType(): Promise<void> {
  const answers = await inquirer.prompt({
    name: "project_type",
    type: "list",
    message: "What type of project do you want to create?\n",
    choices: ["react-vite", "next"],
  });

  // Call the handleAnswer function with the selected project type
  return handleAnswer(answers.project_type);
}

/**
 * Function to handle the user's choice of project type.
 * Depending on the user's choice, it calls the appropriate function to create the project.
 *
 * @param choice - The user's choice of project type. It can be either "react-vite" or "next".
 *
 * @returns {Promise<void>} - The function does not return anything.
 *
 * @throws Will throw an error if an invalid project type is chosen.
 */
async function handleAnswer(choice: string): Promise<void> {
  if (choice === "react-vite") {
    // Call the function to create a Vite React app
    createViteReactApp();
  } else if (choice === "next") {
    // Call the function to create a Next.js app
    createNextApp();
  } else {
    // If an invalid project type is chosen, display an error message and exit the process
    const spinner = createSpinner(`Please wait while we run ${choice}`).start();
    await sleep();
    spinner.error({ text: "Please choose a valid project type!" });
    process.exit(1);
  }
}

/**
 * Function to create a Next.js app.
 * This function uses the `execSync` function to run a command that creates a new Next.js app with the specified project name.
 * It also installs additional dependencies using `pnpm` and displays a success message using a spinner.
 *
 * @returns {Promise<void>} - The function does not return anything.
 *
 * @throws Will throw an error if the command execution fails.
 */
async function createNextApp(): Promise<void> {
  const spinner = createSpinner("Please wait while we run next-app\n").start();
  // execSync(
  //   `pnpm create next-app ${PROJECT_NAME} --ts --tailwind --eslint --app --src-dir --import-alias @/* --use-pnpm --skip-install | cd ${PROJECT_NAME} | pnpm i -d prettier-plugin-tailwind drizzle-kit | pnpm i zod react-hook-form @clerk/nextjs drizzle-orm `
  // );
  // execSync(`mkdir ${PROJECT_NAME} && cd ${PROJECT_NAME}`);
  execSync(`git clone https://github.com/alastisolutions/nextjs-template.git`);

  spinner.success({
    text: "Project created successfully!",
  });

  console.log(
    `\n\n${chalk.yellowBright(
      "Don't forget to rename the folder and run "
    )}${chalk.underline(
      chalk.bgGreen(chalk.black("pnpm install"))
    )}${chalk.yellowBright("!")}`
  );
  process.exit(0);
}

/**
 * Function to create a Vite React app.
 * This function uses the `execSync` function to run a command that creates a new Vite React app with the specified project name.
 * It also installs the `prettier-plugin-tailwind` as a development dependency.
 *
 * @returns {Promise<void>} - The function does not return anything.
 *
 * @throws Will throw an error if the command execution fails.
 */
async function createViteReactApp(): Promise<void> {
  const spinner = createSpinner(
    "Please wait while we run vite@latest\n"
  ).start();
  execSync(
    `pnpm create vite@latest ${PROJECT_NAME}  --template react-ts | cd ${PROJECT_NAME} | pnpm i -d prettier-plugin-tailwind`
  );
  spinner.success({
    text: "Project created successfully! Don't forget to npm i",
  });
  process.exit(0);
}

await welcome();
// await getProjectName();
await getProjectType();
