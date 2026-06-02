
export const SectionHeader = ({ titulo }: { titulo: string }) => {
  return (
    <div className="mb-4 flex items-end justify-between text-foreground">
      <h2 className="text-xl font-bold">{titulo}</h2>
    </div>
  )
}