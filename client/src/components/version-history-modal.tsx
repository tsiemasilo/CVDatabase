import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { Clock, User, Eye, Plus, Edit, Trash2, FileText, History, ArrowRight, Zap } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface VersionHistoryRecord {
  id: number;
  table_name: string;
  record_id: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  old_values: string | null;
  new_values: string | null;
  changed_fields: string | null;
  user_id: number;
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
  const queryClient = useQueryClient();
  
  // Invalidate cache when modal opens to ensure fresh data
  useEffect(() => {
    if (isOpen) {
      queryClient.invalidateQueries({ queryKey: ["version-history-all"] });
      queryClient.invalidateQueries({ queryKey: ["version-history-record"] });
    }
  }, [isOpen, queryClient]);

  // Query for record-specific history with proper error handling
  const recordHistoryQuery = useQuery({
    queryKey: [`/api/version-history/${tableName}/${recordId}`, Date.now()],
    queryFn: async (): Promise<VersionHistoryRecord[]> => {
      if (!tableName || !recordId) return [];
      
      try {
        console.log(`🔍 Fetching record version history for ${tableName}/${recordId}`);
        const response = await fetch(`/api/version-history/${tableName}/${recordId}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        console.log(`📡 Record version history response: ${response.status} ${response.statusText}`);
        
        if (response.status === 401) {
          console.log('🔒 Version history requires authentication');
          return [];
        }
        
        if (!response.ok) {
          console.error(`❌ Record version history failed: ${response.status}`);
          throw new Error(`Failed to fetch version history: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`📊 Record version history data:`, data);
        return data;
      } catch (error) {
        console.error('Version history fetch error:', error);
        throw error;
      }
    },
    enabled: isOpen && !!tableName && !!recordId,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: selectedTab === 'record' && isOpen ? 2000 : false,
  });

  // Query for all recent history with proper error handling
  const allHistoryQuery = useQuery({
    queryKey: [`/api/version-history?limit=50`, Date.now()],
    queryFn: async (): Promise<VersionHistoryRecord[]> => {
      try {
        console.log(`🔍 Fetching all version history (limit: 50)`);
        const response = await fetch('/api/version-history?limit=50', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        console.log(`📡 All version history response: ${response.status} ${response.statusText}`);
        
        if (response.status === 401) {
          console.log('🔒 Version history requires authentication');
          return [];
        }
        
        if (!response.ok) {
          console.error(`❌ All version history failed: ${response.status}`);
          throw new Error(`Failed to fetch version history: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`📊 All version history data:`, data);
        return data;
      } catch (error) {
        console.error('Version history fetch error:', error);
        throw error;
      }
    },
    enabled: isOpen,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: selectedTab === 'all' && isOpen ? 2000 : false,
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

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (value === '') return 'Empty';
    
    // Format date strings
    if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        }
      } catch (e) {
        // Fall through to default string handling
      }
    }
    
    return String(value);
  };

  const VersionHistoryList = ({ records }: { records: VersionHistoryRecord[] }) => {
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const [highlightedChanges, setHighlightedChanges] = useState<Set<string>>(new Set());
    const [animatingFields, setAnimatingFields] = useState<Set<string>>(new Set());

    const toggleExpanded = (id: number) => {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      setExpandedItems(newExpanded);
    };

    const highlightChange = (recordId: number, field: string) => {
      const key = `${recordId}-${field}`;
      setHighlightedChanges(prev => new Set([...Array.from(prev), key]));
      setAnimatingFields(prev => new Set([...Array.from(prev), key]));
      
      setTimeout(() => {
        setAnimatingFields(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }, 600);

      setTimeout(() => {
        setHighlightedChanges(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }, 2000);
    };

    console.log(`📋 VersionHistoryList rendering with ${records.length} records`);
    
    if (records.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <History className="h-12 w-12 mb-4" />
          <p>No version history available</p>
          <p className="text-xs mt-2">Check browser console for debugging information</p>
        </div>
      );
    }

    return (
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {records.map((record, recordIndex) => {
            const isExpanded = expandedItems.has(record.id);
            const changedFields = record.changed_fields ? JSON.parse(record.changed_fields) : [];
            const oldValues = record.old_values ? JSON.parse(record.old_values) : null;
            const newValues = record.new_values ? JSON.parse(record.new_values) : null;

            return (
              <div 
                key={record.id} 
                className="border rounded-lg p-4 hover:bg-muted/50 transition-all duration-300 hover:shadow-md hover:border-primary/20 animate-in fade-in-50 slide-in-from-left-5"
                style={{ animationDelay: `${recordIndex * 150}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full text-white ${getActionColor(record.action)} transition-all duration-300 hover:scale-110 hover:shadow-lg`}>
                      {getActionIcon(record.action)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{record.action}</Badge>
                        <span className="text-sm font-medium">{getTableDisplayName(record.table_name)}</span>
                        <span className="text-sm text-muted-foreground">#{record.record_id}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {record.description || `${record.action.toLowerCase()} operation on ${record.table_name}`}
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
                      <Button variant="ghost" size="sm" className="h-6 p-0 font-normal group hover:bg-primary/10 transition-all duration-200">
                        <div className="flex items-center">
                          {isExpanded ? 
                            <ChevronDown className="h-4 w-4 transition-transform duration-200" /> : 
                            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                          }
                          <span className="ml-1 group-hover:text-primary transition-colors duration-200">
                            {record.action === 'CREATE' && (
                              <span className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                View created data
                              </span>
                            )}
                            {record.action === 'UPDATE' && (
                              <span className="flex items-center gap-1">
                                <ArrowRight className="h-3 w-3" />
                                View {changedFields.length} changed field{changedFields.length !== 1 ? 's' : ''}
                              </span>
                            )}
                            {record.action === 'DELETE' && 'View deleted data'}
                          </span>
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-up-2 data-[state=open]:slide-down-2">
                      <div className="bg-muted/50 rounded-md p-3 space-y-2 animate-in slide-in-from-top-2 duration-300">
                        {record.action === 'CREATE' && newValues && (
                          <div className="animate-in fade-in-50 slide-in-from-top-2 duration-500">
                            <h5 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                              <Zap className="h-4 w-4 animate-pulse" />
                              Created Data:
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {Object.entries(newValues).map(([key, value], index) => (
                                <div 
                                  key={key} 
                                  className="text-xs p-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                                  style={{ animationDelay: `${index * 50}ms` }}
                                >
                                  <div className="font-medium text-green-700 dark:text-green-400 mb-1">
                                    {formatFieldName(key)}:
                                  </div>
                                  <div className="text-muted-foreground font-mono text-xs bg-white dark:bg-gray-800 p-1 rounded border">
                                    {formatValue(value)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {record.action === 'UPDATE' && changedFields.map((field: string, index: number) => {
                          const key = `${record.id}-${field}`;
                          const isHighlighted = highlightedChanges.has(key);
                          const isAnimating = animatingFields.has(key);
                          
                          return (
                            <div 
                              key={field} 
                              className={`border-l-2 border-blue-500 pl-3 transition-all duration-500 hover:border-primary hover:bg-primary/5 rounded-r-md cursor-pointer group ${
                                isHighlighted ? 'bg-primary/10 border-primary shadow-md' : ''
                              }`}
                              style={{ animationDelay: `${index * 100}ms` }}
                              onClick={() => highlightChange(record.id, field)}
                            >
                              <div className="text-sm font-medium flex items-center gap-2 group-hover:text-primary transition-colors">
                                {formatFieldName(field)}
                                <ArrowRight className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                                  isAnimating ? 'animate-pulse scale-110' : ''
                                }`} />
                              </div>
                              <div className="text-xs space-y-2 mt-2">
                                <div className={`text-red-600 p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 transition-all duration-300 hover:scale-[1.02] ${
                                  isAnimating ? 'animate-in slide-in-from-left-2' : ''
                                }`}>
                                  <span className="font-medium flex items-center gap-1">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    From:
                                  </span>
                                  <div className="ml-3 font-mono text-xs bg-white dark:bg-gray-800 p-1 rounded border mt-1">
                                    {formatValue(oldValues?.[field])}
                                  </div>
                                </div>
                                <div className={`text-green-600 p-2 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 transition-all duration-300 hover:scale-[1.02] ${
                                  isAnimating ? 'animate-in slide-in-from-right-2' : ''
                                }`}>
                                  <span className="font-medium flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    To:
                                  </span>
                                  <div className="ml-3 font-mono text-xs bg-white dark:bg-gray-800 p-1 rounded border mt-1">
                                    {formatValue(newValues?.[field])}
                                  </div>
                                </div>
                              </div>
                              {isHighlighted && (
                                <div className="mt-2 text-xs text-muted-foreground animate-in fade-in-50 slide-in-from-bottom-1 duration-300">
                                  <div className="flex items-center gap-1">
                                    <Zap className="h-3 w-3 text-yellow-500" />
                                    Change highlighted
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {record.action === 'DELETE' && oldValues && (
                          <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                            <h5 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                              <Trash2 className="h-4 w-4 animate-pulse" />
                              Deleted Data:
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {Object.entries(oldValues).map(([key, value], index) => (
                                <div 
                                  key={key} 
                                  className="text-xs p-2 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800 hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer opacity-75 hover:opacity-100"
                                  style={{ animationDelay: `${index * 50}ms` }}
                                >
                                  <div className="font-medium text-red-700 dark:text-red-400 mb-1 line-through">
                                    {formatFieldName(key)}:
                                  </div>
                                  <div className="text-muted-foreground font-mono text-xs bg-white dark:bg-gray-800 p-1 rounded border line-through">
                                    {formatValue(value)}
                                  </div>
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
      <DialogContent className="max-w-4xl max-h-[80vh] animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-8 duration-300">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            View the complete history of changes made to records in the system
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full animate-in fade-in-50 slide-in-from-top-2 duration-500">
          <TabsList className="grid w-full grid-cols-2 animate-in slide-in-from-top-3 duration-400">
            <TabsTrigger 
              value="record" 
              disabled={!tableName || !recordId}
              className="transition-all duration-300 hover:bg-primary/10 data-[state=active]:shadow-md"
            >
              This Record {tableName && recordId && `(${getTableDisplayName(tableName)} #${recordId})`}
            </TabsTrigger>
            <TabsTrigger 
              value="all"
              className="transition-all duration-300 hover:bg-primary/10 data-[state=active]:shadow-md"
            >
              All Recent Changes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="mt-4">
            {recordHistoryQuery.isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 border-2 border-primary opacity-20"></div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium animate-pulse">Loading version history...</p>
                  <p className="text-xs text-muted-foreground mt-1">Fetching changes for this record</p>
                </div>
              </div>
            ) : recordHistoryQuery.error ? (
              <div className="text-center py-8 text-red-600">
                Failed to load record history
              </div>
            ) : (
              <VersionHistoryList records={(recordHistoryQuery.data as VersionHistoryRecord[]) || []} />
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            {allHistoryQuery.isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <div className="animate-ping absolute inset-0 rounded-full h-12 w-12 border-2 border-primary opacity-20"></div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium animate-pulse">Loading all recent changes...</p>
                  <p className="text-xs text-muted-foreground mt-1">Fetching system-wide version history</p>
                </div>
              </div>
            ) : allHistoryQuery.error ? (
              <div className="text-center py-8 text-red-600">
                Failed to load version history
              </div>
            ) : (
              <VersionHistoryList records={(allHistoryQuery.data as VersionHistoryRecord[]) || []} />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}