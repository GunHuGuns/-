import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleForm } from "@/components/modules/module-form";

export default function NewModulePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>新增模块</CardTitle>
          <CardDescription>
            创建一个新的系统模块，填写基本信息并选择覆盖范围
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ModuleForm />
        </CardContent>
      </Card>
    </div>
  );
}
