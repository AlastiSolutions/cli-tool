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

    ${chalk.yellowBright("Don't run this tool in a production environment.")}

    Let's start!
    `);
}

async function handleAnswer(choice: string) {
  if (choice === "react-vite") {
    const spinner = createSpinner(
      "Please wait while we run vite@latest\n"
    ).start();
    // await sleep();
    execSync(`pnpm create vite@latest ${PROJECT_NAME}  --template react-ts`);
    spinner.success({
      text: "Project created successfully! Don't forget to npm i",
    });
    process.exit(0);
  } else if (choice === "react") {
    const spinner = createSpinner(
      "Please wait while we run create-react-app\n"
    ).start();
    // await sleep();
    execSync(`npx create-react-app ${PROJECT_NAME} --template typescript`);
    spinner.success({ text: "Project created successfully!" });
    process.exit(0);
  } else if (choice === "next") {
    const spinner = createSpinner(
      "Please wait while we run next-app\n"
    ).start();
    // await sleep();
    execSync(
      `pnpm create next-app ${PROJECT_NAME} --ts --tailwind --eslint --app --src-dir --import-alias @/* --use-pnpm --skip-install`
    );
    spinner.success({
      text: "Project created successfully! Don't forget to pnpm i",
    });
    process.exit(0);
  } else {
    const spinner = createSpinner(`Please wait while we run ${choice}`).start();
    await sleep();
    spinner.error({ text: "Please choose a valid project type!" });
    process.exit(1);
  }
}

async function getProjectName() {
  const answers = await inquirer.prompt({
    name: "project_name",
    type: "input",
    message: "What is the name of your project?\n",
    default() {
      return "my-project";
    },
  });

  PROJECT_NAME = answers.project_name;
}

async function getProjectType() {
  const answers = await inquirer.prompt({
    name: "project_type",
    type: "list",
    message: "What type of project do you want to create?\n",
    choices: ["react-vite", "react", "next"],
  });

  return handleAnswer(answers.project_type);
}

await welcome();
await getProjectName();
await getProjectType();
