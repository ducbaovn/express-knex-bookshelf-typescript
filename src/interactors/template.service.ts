import { BaseService } from "./base.service";
import { TemplateModel } from "../models";
import { TemplateRepository } from "../data";

export class TemplateService extends BaseService<TemplateModel, typeof TemplateRepository > {
    constructor() {
        super(TemplateRepository);
    }
}

export default TemplateService;
