import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { Clock, User, Eye, Plus, Edit, Trash2, FileText, History } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface VersionHistoryRecord {
  id: number;
  tableName: string;
  recordId: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  oldValues: string | null;
  newValues: string | null;
  changedFields: string | null;
  userId: number;
  username: string;
  timestamp: string;
  description: string | null;
}

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName?: string;
  recordId?: number;
  title?: string;
}

export function VersionHistoryModal({ 
  isOpen, 
  onClose, 
  tableName, 
  recordId, 
  title = "Version History" 
}: VersionHistoryModalProps) {
  const [selectedTab, setSelectedTab] = useState<string>("record");

  // Query for record-specific history
  const recordHistoryQuery = useQuery({
    queryKey: ['version-history-record', tableName, recordId],
    queryFn: async (): Promise<VersionHistoryRecord[]> => {
      if (!tableName || !recordId) return [];
      const response = await fetch(`/api/version-history/${tableName}/${recordId}`);
      if (!response.ok) throw new Error('Failed to fetch record history');
      return response.json();
    },
    enabled: isOpen && !!tableName && !!recordId,
  });

  // Query for all recent history
  const allHistoryQuery = useQuery({
    queryKey: ['version-history-all'],
    queryFn: async (): Promise<VersionHistoryRecord[]> => {
      const response = await fetch('/api/version-history?limit=50');
      if (!response.ok) throw new Error('Failed to fetch version history');
      return response.json();
    },
    enabled: isOpen,
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <Plus className="h-4 w-4" />;
      case 'UPDATE': return <Edit className="h-4 w-4" />;
      case 'DELETE': return <Trash2 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-500';
      case 'UPDATE': return 'bg-blue-500';
      case 'DELETE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTableDisplayName = (tableName: string) => {
    switch (tableName) {
      case 'cv_records': return 'CV Records';
      case 'user_profiles': return 'User Profiles';
      case 'qualifications': return 'Qualifications';
      case 'positions_roles': return 'Positions/Roles';
      case 'tenders': return 'Tenders';
      default: return tableName;
    }
  };

  const formatFieldName = (field: string) => {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ');
  };

  const VersionHistoryList = ({ records }: { records: VersionHistoryRecord[] }) => {
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

    const toggleExpanded = (id: number) => {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      setExpandedItems(newExpanded);
    };

    if (records.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <History className="h-12 w-12 mb-4" />
          <p>No version history available</p>
        </div>
      );
    }

    return (
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {records.map((record) => {
            const isExpanded = expandedItems.has(record.id);
            const changedFields = record.changedFields ? JSON.parse(record.changedFields) : [];
            const oldValues = record.oldValues ? JSON.parse(record.oldValues) : null;
            const newValues = record.newValues ? JSON.parse(record.newValues) : null;

            return (
              <div key={record.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full text-white ${getActionColor(record.action)}`}>
                      {getActionIcon(record.action)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{record.action}</Badge>
                        <span className="text-sm font-medium">{getTableDisplayName(record.tableName)}</span>
                        <span className="text-sm text-muted-foreground">#{record.recordId}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {record.description || `${record.action.toLowerCase()} operation on ${record.tableName}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 mb-1">
                      <User className="h-3 w-3" />
                      <span className="font-medium">{record.username}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(record.timestamp), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>

                {(changedFields.length > 0 || record.action === 'CREATE' || record.action === 'DELETE') && (
                  <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(record.id)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 p-0 font-normal">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <span className="ml-1">
                          {record.action === 'CREATE' && 'View created data'}
                          {record.action === 'UPDATE' && `View ${changedFields.length} changed field${changedFields.length !== 1 ? 's' : ''}`}
                          {record.action === 'DELETE' && 'View deleted data'}
                        </span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3">
                      <div className="bg-muted/50 rounded-md p-3 space-y-2">
                        {record.action === 'CREATE' && newValues && (
                          <div>
                            <h5 className="text-sm font-semibold text-green-700 mb-2">Created Data:</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {Object.entries(newValues).map(([key, value]) => (
                                <div key={key} className="text-xs">
                                  <span className="font-medium">{formatFieldName(key)}:</span>{' '}
                                  <span className="text-muted-foreground">
                                    {value !== null && value !== undefined ? String(value) : 'N/A'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {record.action === 'UPDATE' && changedFields.map((field: string) => (
                          <div key={field} className="border-l-2 border-blue-500 pl-3">
                            <div className="text-sm font-medium">{formatFieldName(field)}</div>
                            <div className="text-xs space-y-1">
                              <div className="text-red-600">
                                <span className="font-medium">From:</span>{' '}
                                {oldValues?.[field] !== null && oldValues?.[field] !== undefined 
                                  ? String(oldValues[field]) 
                                  : 'N/A'}
                              </div>
                              <div className="text-green-600">
                                <span className="font-medium">To:</span>{' '}
                                {newValues?.[field] !== null && newValues?.[field] !== undefined 
                                  ? String(newValues[field]) 
                                  : 'N/A'}
                              </div>
                            </div>
                          </div>
                        ))}

                        {record.action === 'DELETE' && oldValues && (
                          <div>
                            <h5 className="text-sm font-semibold text-red-700 mb-2">Deleted Data:</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {Object.entries(oldValues).map(([key, value]) => (
                                <div key={key} className="text-xs">
                                  <span className="font-medium">{formatFieldName(key)}:</span>{' '}
                                  <span className="text-muted-foreground">
                                    {value !== null && value !== undefined ? String(value) : 'N/A'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            View the complete history of changes made to records in the system
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="record" disabled={!tableName || !recordId}>
              This Record {tableName && recordId && `(${getTableDisplayName(tableName)} #${recordId})`}
            </TabsTrigger>
            <TabsTrigger value="all">All Recent Changes</TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="mt-4">
            {recordHistoryQuery.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : recordHistoryQuery.error ? (
              <div className="text-center py-8 text-red-600">
                Failed to load record history
              </div>
            ) : (
              <VersionHistoryList records={recordHistoryQuery.data || []} />
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            {allHistoryQuery.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : allHistoryQuery.error ? (
              <div className="text-center py-8 text-red-600">
                Failed to load version history
              </div>
            ) : (
              <VersionHistoryList records={allHistoryQuery.data || []} />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}