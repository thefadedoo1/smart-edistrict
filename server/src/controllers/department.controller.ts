import { Request, Response } from "express";
import { createDepartmentSchema } from "../validators/department.validator";
import {
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
  getDepartmentCatalog,
} from "../services/department.service";

export async function create(req: Request, res: Response) {
  try {
    const data = createDepartmentSchema.parse(req.body);
    const department = await createDepartment(data);

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAll(req: Request, res: Response) {
  const departments = await getAllDepartments();
  return res.json({
    success: true,
    data: departments,
  });
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const department = await updateDepartment(id, req.body);

    return res.json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    await deleteDepartment(id);

    return res.json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function catalog(req: Request, res: Response) {
  try {
    const catalog = await getDepartmentCatalog();
    return res.json({
      success: true,
      data: catalog,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}