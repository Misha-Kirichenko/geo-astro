import { Injectable } from '@nestjs/common';
import { LangEnum, ServiceEnum } from 'src/common/enums';
import { RegExpContext } from 'src/common/interfaces';
import { CHOOSE_ACTION, FILL_FORM } from '../constants';
import { SERVICE_FORM_VALIDATION } from '../validation/service-form.validation';
import { getNavMenu } from 'src/utils';

@Injectable()
export class TgBotServiceFormService {
  public async runStage(ctx: RegExpContext): Promise<void> {
    if (
      !ctx.session.serviceItem ||
      !ctx.session.serviceItem.serviceSlug ||
      !('stage' in ctx.session.serviceItem) ||
      ctx.session.serviceItem['stage'] === undefined ||
      ctx.session.serviceItem['stage'] === null
    )
      return;

    const fieldValue = ctx.match[0];
    const { serviceSlug, stage } = ctx.session.serviceItem;
    const { lang: currentLang } = ctx.session;
    const serviceFormValidationObj = SERVICE_FORM_VALIDATION(
      currentLang as LangEnum,
    );

    const rules = serviceFormValidationObj[serviceSlug];
    if (!rules) return;

    const rule = rules[Number(stage)];

    const fieldValid = rule.validator(fieldValue);

    if (!fieldValid) {
      await ctx.reply(rule.errorMessage);
      return;
    }
    if (!ctx.session.serviceItem.form1) {
      ctx.session.serviceItem.form1 = {};
    }
    if (
      serviceSlug === ServiceEnum.synastry &&
      !ctx.session.serviceItem.form2
    ) {
      ctx.session.serviceItem.form2 = {};
    }

    if (serviceSlug === ServiceEnum.synastry && ctx.session.serviceItem.form2) {
      const { form1 } = ctx.session.serviceItem;

      const form1FilledFieldsCount = Object.keys(form1).length;

      if (form1FilledFieldsCount < rules.length / 2) {
        ctx.session.serviceItem.form1[rule.fieldName] = fieldValue;
      } else {
        ctx.session.serviceItem.form2[rule.fieldName] = fieldValue;
      }
    } else {
      ctx.session.serviceItem.form1[rule.fieldName] = fieldValue;
    }

    ctx.session.serviceItem.stage++;

    await this.getNextStageTip(ctx);
  }

  private async getNextStageTip(ctx: RegExpContext): Promise<void> {
    if (
      !ctx.session.serviceItem ||
      !ctx.session.serviceItem.serviceSlug ||
      !('stage' in ctx.session.serviceItem) ||
      ctx.session.serviceItem['stage'] === undefined ||
      ctx.session.serviceItem['stage'] === null
    )
      return;

    const currentLang =
      ctx.session.lang || ctx.from?.language_code || LangEnum.EN;
    const serviceFormValidationObj = SERVICE_FORM_VALIDATION(
      currentLang as LangEnum,
    );
    const rules = serviceFormValidationObj[ctx.session.serviceItem.serviceSlug];
    if (!rules) return;

    if (ctx.session.serviceItem.stage < rules.length) {
      const rule = rules[Number(ctx.session.serviceItem.stage)];
      const replyKeyboard = getNavMenu(ctx);
      await ctx.reply(rule.fieldTip, replyKeyboard);
    } else {
      const replyKeyboard = getNavMenu(ctx);
      await ctx.reply(CHOOSE_ACTION[currentLang as LangEnum], replyKeyboard);
    }
    console.log(ctx.session.serviceItem);
    return;
  }

  public async getFistStageTip(ctx: RegExpContext): Promise<void> {
    const [, serviceSlug, stage] = ctx.match;
    if (!serviceSlug) return;
    const message = FILL_FORM[ctx.session.lang as LangEnum];
    await ctx.reply(message);
    const serviceFormValidationObj = SERVICE_FORM_VALIDATION(
      ctx.session.lang as LangEnum,
    );
    const rules = serviceFormValidationObj[serviceSlug as ServiceEnum];
    if (!rules) return;

    const rule = rules[Number(stage)];
    if (!rule) return;
    if (ctx.session.serviceItem)
      ctx.session.serviceItem['stage'] = Number(stage);
    const replyKeyboard = getNavMenu(ctx);
    await ctx.reply(rule.fieldTip, replyKeyboard);
    await ctx.answerCbQuery();
  }
}
