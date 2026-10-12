import Link from "next/link";
import { SplitBar } from "@/components/split-bar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatToken, relTime, shortAddr } from "@/lib/format";
import type { Funding } from "@/lib/mock/types";

export function LedgerTable({ rows }: { rows: Funding[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-[10px] border border-dashed border-border px-4 py-10 text-center">
        <p className="font-medium">No funding yet</p>
        <p className="mt-1 text-sm text-muted-foreground">The first contribution will show up here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funder</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden sm:table-cell">To maintainers</TableHead>
            <TableHead className="hidden md:table-cell">Tx</TableHead>
            <TableHead className="text-right">When</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const toMaintainer = row.amount - row.feeAmount;
            return (
              <TableRow key={row.id}>
                <TableCell className="font-mono text-xs">
                  {row.displayName ?? shortAddr(row.tipperAddress)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-xs text-brand tabular-nums">
                      +{formatToken(row.amount, row.token)} {row.token}
                    </span>
                    <SplitBar className="hidden max-w-24 sm:flex" />
                  </div>
                </TableCell>
                <TableCell className="hidden font-mono text-xs tabular-nums sm:table-cell">
                  {formatToken(toMaintainer, row.token)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline" render={<Link href={`/explorer/${row.txHash}`} />}>
                    {shortAddr(row.txHash)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">{relTime(row.timestamp)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
