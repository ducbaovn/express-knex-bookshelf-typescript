import { BaseRepository } from "./base.repository";
import { TemplateDto } from "./sql/models";
import { TemplateModel } from "../models";

export class TemplateRepository extends BaseRepository<TemplateDto, TemplateModel> {
    constructor() {
        super(TemplateDto, TemplateModel, {
            fromDto: TemplateModel.fromDto,
            toDto: TemplateModel.toDto,
        });
    }
}
export default TemplateRepository;
