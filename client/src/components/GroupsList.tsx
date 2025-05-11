import { Group } from "@/pages/ProductManagement";
import { Card, CardContent } from "@/components/ui/card";

interface GroupsListProps {
  groups: Group[];
}

function GroupsList({ groups }: GroupsListProps) {
  return (
    <div className="space-y-3">
      {groups.length === 0 ? (
        <p className="text-gray-500">لا توجد مجموعات حتى الآن</p>
      ) : (
        groups.map((group) => (
          <Card key={group.id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{group.name}</h3>
              {group.notes && <p className="text-gray-600 mt-1">{group.notes}</p>}
              <p className="text-sm text-gray-500 mt-2">
                عدد المنتجات: {group.products?.length || 0}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default GroupsList;
