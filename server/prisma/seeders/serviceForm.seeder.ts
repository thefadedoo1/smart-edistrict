import { PrismaClient, FormFieldType } from "@prisma/client";
import { serviceForms } from "../data/serviceForms";

export async function seedServiceForms(
  prisma: PrismaClient
) {
  console.log("📝 Seeding Service Forms...");

  for (const formData of serviceForms) {
    const service = await prisma.certificateService.findUnique({
      where: {
        code: formData.serviceCode,
      },
    });

    if (!service) {
      console.warn(
        `⚠️ Service ${formData.serviceCode} not found. Skipping...`
      );
      continue;
    }

    const form = await prisma.serviceForm.upsert({
      where: {
        serviceId: service.id,
      },
      update: {
        title: formData.title,
        description: formData.description,
      },
      create: {
        title: formData.title,
        description: formData.description,
        serviceId: service.id,
      },
    });

    // Remove old fields so the seed stays idempotent
    await prisma.serviceFormField.deleteMany({
      where: {
        formId: form.id,
      },
    });

    for (const field of formData.fields) {
      await prisma.serviceFormField.create({
        data: {
          label: field.label,
          fieldKey: field.fieldKey,
          fieldType: FormFieldType[field.fieldType as keyof typeof FormFieldType],
          placeholder: field.placeholder,
          defaultValue: null,
          isRequired: field.isRequired,
          displayOrder: field.displayOrder,
          options: null,
          formId: form.id,
        },
      });
    }
  }

  console.log("✅ Service Forms Seeded");
}