import { Fragment } from 'react'

export default function OrderItemCustomizations({
  customizations,
}: {
  customizations: ReadonlyArray<[string, ReadonlyArray<string>]>
}) {
  return customizations.length > 0
    ? customizations.map(([group, options]) => (
        <Fragment key={group}>
          {`${group}: ${options.length > 0 ? options.join(', ') : '-'}`}
          <br />
        </Fragment>
      ))
    : 'No customization'
}
