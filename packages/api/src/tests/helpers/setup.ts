import { studentPropertiesService } from "@pedaki/services/students/properties.service.js";
import {beforeAll, beforeEach} from "vitest";

beforeAll(async () => {
    await studentPropertiesService.reload();
});

beforeEach(async () => {
    await studentPropertiesService.reload();
});