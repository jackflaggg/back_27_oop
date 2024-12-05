import {agent} from "supertest";
import {app} from "../../src/main";

export const req = agent(app);


