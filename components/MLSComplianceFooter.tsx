interface MLSComplianceFooterProps {
  listingAgent?: string;
  listingOfficeName?: string;
  mlsSource?: string;
  mlsId?: string;
  lastUpdated?: string;
}

export function MLSComplianceFooter({
  listingAgent,
  listingOfficeName,
  mlsSource,
  mlsId,
  lastUpdated,
}: MLSComplianceFooterProps) {
  // Don't render if no data available
  if (!listingAgent && !listingOfficeName && !mlsSource) {
    return null;
  }

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="text-xs text-gray-600 space-y-1">
        {listingOfficeName && (
          <p>
            <span className="font-medium">Listing Courtesy of:</span> {listingOfficeName}
          </p>
        )}
        {listingAgent && (
          <p>
            <span className="font-medium">Listing Agent:</span> {listingAgent}
          </p>
        )}
        {mlsSource && mlsId && (
          <p>
            <span className="font-medium">MLS Source:</span> {mlsSource} | MLS #{mlsId}
          </p>
        )}
        {lastUpdated && (
          <p className="text-[10px] text-gray-500 mt-2">
            Data last updated: {new Date(lastUpdated).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
