export default function Layout({ children }: LayoutProps<'/'>) {
  return <div className="flex-1 flex flex-col justify-center">{children}</div>
}
