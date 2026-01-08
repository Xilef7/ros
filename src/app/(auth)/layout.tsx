export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex-1 flex flex-col justify-center p-4">{children}</div>
  )
}
