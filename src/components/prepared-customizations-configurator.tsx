'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { Doc } from '@/convex/_generated/dataModel'
import { calculateOrderItemPrice, formatPrice } from '@/lib/price'
import { CheckCircle2Icon, XCircleIcon } from 'lucide-react'
import { Fragment, ReactNode, useState } from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import {
  useAddPreparedOrderItemMutation,
  useLocalCustomizationsMutation,
} from '@/lib/hooks/local'
import { LocalOrderItem } from '@/lib/types'

export default function PreparedCustomizationsConfigurator({
  trigger,
  orderItem,
  menuItem: { _id: menuItemId, name, description, price, customizations },
}: {
  trigger: ReactNode
  orderItem?: Pick<LocalOrderItem, 'id' | 'customizations'>
  menuItem: Pick<
    Doc<'menuItems'>,
    '_id' | 'name' | 'description' | 'price' | 'customizations'
  >
}) {
  const handleAddOrderItem = useAddPreparedOrderItemMutation()
  const handleUpdateCustomizations = useLocalCustomizationsMutation()

  const initialCustomizations = Object.fromEntries(
    orderItem
      ? Object.entries(orderItem.customizations).map(
          ([group, customization]) => [group, [...customization]],
        )
      : customizations.map(({ name }) => [name, []]),
  )

  const [selectedCustomizations, setCustomizations] = useState(
    initialCustomizations,
  )

  const formatPriceAdjustment = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    signDisplay: 'always',
  }).format

  const formattedPrice = formatPrice(
    calculateOrderItemPrice({ price, customizations }, selectedCustomizations),
  )

  const hasInvalidCustomization = customizations.some(
    ({ name, minRequired, maxAdditional }) => {
      const length = selectedCustomizations[name].length

      return length < minRequired || length > minRequired + maxAdditional
    },
  )

  return (
    <Sheet>
      {customizations.length > 0 ? (
        <SheetTrigger
          onClick={() => setCustomizations(initialCustomizations)}
          asChild
        >
          {trigger}
        </SheetTrigger>
      ) : null}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto flex flex-col p-4 gap-8">
          {customizations.length > 0 ? (
            <>
              {customizations.map((customization, index) => {
                const minSelected = customization.minRequired
                const maxSelected = minSelected + customization.maxAdditional

                let constraint: string = ''
                if (minSelected) {
                  if (minSelected !== maxSelected) {
                    if (customization.options.length > maxSelected) {
                      constraint = `Select ${minSelected} to ${maxSelected}`
                    } else {
                      constraint = `Select ${minSelected} or more`
                    }
                  } else {
                    constraint = `Select ${minSelected}`
                  }
                } else if (customization.options.length > maxSelected) {
                  constraint = `Select up to ${maxSelected}`
                }

                const selectedCustomization =
                  selectedCustomizations[customization.name]

                return (
                  <Fragment key={customization.name}>
                    <FieldSet>
                      <FieldLegend>{customization.name}</FieldLegend>
                      <FieldDescription className="flex items-center gap-2">
                        {constraint}
                        {selectedCustomization.length < minSelected ? (
                          <CheckCircle2Icon className="stroke-muted-foreground" />
                        ) : selectedCustomization.length > maxSelected ? (
                          <XCircleIcon className="stroke-destructive" />
                        ) : (
                          <CheckCircle2Icon className="stroke-green-600" />
                        )}
                      </FieldDescription>
                      <FieldGroup>
                        {customization.options.map((option) => {
                          const id = `${customization.name}.${option.name}`
                          return (
                            <Field key={option.name} orientation="horizontal">
                              <Checkbox
                                id={id}
                                checked={selectedCustomization.includes(
                                  option.name,
                                )}
                                onCheckedChange={(checked) =>
                                  setCustomizations({
                                    ...selectedCustomizations,
                                    [customization.name]:
                                      checked === 'indeterminate'
                                        ? selectedCustomization
                                        : checked
                                          ? [
                                              ...selectedCustomization,
                                              option.name,
                                            ]
                                          : selectedCustomization.filter(
                                              (selectedOption) =>
                                                selectedOption !== option.name,
                                            ),
                                  })
                                }
                              />
                              <FieldLabel htmlFor={id}>
                                {option.name}
                                {option.price !== 0 && (
                                  <span className="ml-0.5 text-neutral-500">{`(${formatPriceAdjustment(option.price)})`}</span>
                                )}
                              </FieldLabel>
                            </Field>
                          )
                        })}
                      </FieldGroup>
                    </FieldSet>
                    {index !== customizations.length - 1 && <FieldSeparator />}
                  </Fragment>
                )
              })}
            </>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No customizations</EmptyTitle>
              </EmptyHeader>
            </Empty>
          )}
        </div>
        <SheetFooter>
          <SheetClose
            onClick={() => setCustomizations(initialCustomizations)}
            asChild
          >
            {orderItem ? (
              <Button
                onClick={() =>
                  handleUpdateCustomizations(
                    orderItem.id,
                    selectedCustomizations,
                  )
                }
                vibe="friendly"
                aria-label="Update order"
                disabled={hasInvalidCustomization}
              >
                {`Update Order (${formattedPrice})`}
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handleAddOrderItem(menuItemId, selectedCustomizations)
                }
                vibe="friendly"
                aria-label="Add to order"
                disabled={hasInvalidCustomization}
              >
                {`Add to Order (${formattedPrice})`}
              </Button>
            )}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
