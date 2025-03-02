#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import { OpenAPISpec } from "./openapiValidator.ts";
import yaml from "js-yaml";

const program = new Command();

program
  .name("open-api-typescript-server")
  .description("CLI to some Open API Stuff")
  .version("0.0.0");

program
  .command("build")
  .description("Output generated code")
  .option("-s, --spec <file>", "OpenAPI spec file", "")
  .option("-o, --out <dir>", "output directory", "")
  .action(async (options) => {
    const specS = fs.readFileSync(options.spec, "utf-8");

    const specPojo = yaml.load(specS) as Map<string, any>;

    const validateSpecResponse = OpenAPISpec.safeParse(specPojo);

    if (!validateSpecResponse.success) {
      console.error(validateSpecResponse.error.errors);
      return;
    }

    console.log("TODO: Implement code generation");
  });

program.parse();
