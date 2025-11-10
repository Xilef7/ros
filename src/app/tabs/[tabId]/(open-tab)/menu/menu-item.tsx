import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Empty } from '@/components/ui/empty'
import { OwnerId, MenuItem, TmpOrderItem, TmpOrderItemId } from '@/lib/types'
import Image from 'next/image'

export default function OrderableMenuItem({
  menuItem,
  orderItems,
  handleAddToOrder,
  handleIncrement,
  handleDecrement,
  myId,
  availableUserIds,
  handleAddOwner,
  handleRemoveOwner,
}: {
  menuItem: MenuItem
  orderItems: TmpOrderItem[]
  handleAddToOrder: () => void
  handleIncrement: (orderItemId: TmpOrderItemId) => void
  handleDecrement: (orderItemId: TmpOrderItemId) => void
  myId: OwnerId
  availableUserIds: OwnerId[]
  handleAddOwner: (orderItemId: TmpOrderItemId, ownerId: OwnerId) => void
  handleRemoveOwner: (orderItemId: TmpOrderItemId, ownerId: OwnerId) => void
}) {
  const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return (
    <div>
      {menuItem.photoPathinfo ? (
        <Image
          src={menuItem.photoPathinfo}
          alt={menuItem.name}
          width={128}
          height={128}
        />
      ) : (
        'No photo'
      )}
      <div>{menuItem.name}</div>
      {menuItem.description && <div>{menuItem.description}</div>}
      <div>{numberFormat.format(menuItem.price)}</div>
      <div>
        {menuItem.portionSize} serving{menuItem.portionSize > 1 ? 's' : ''}
      </div>

      <Drawer>
        {orderItems.length > 0 ? (
          <DrawerTrigger>{orderItems.length} items</DrawerTrigger>
        ) : (
          <Button onClick={handleAddToOrder} aria-label="Add to order">
            Add to Order
          </Button>
        )}
        <DrawerContent>
          <DrawerHeader>{menuItem.name}</DrawerHeader>
          {orderItems.length > 0 ? (
            <ul>
              {orderItems.map((orderItem) => (
                <li key={orderItem.id}>
                  <Dialog>
                    <div>
                      {orderItem.ownerIds.map((ownerId) => {
                        return (
                          <Avatar key={ownerId}>
                            <AvatarImage
                              src={`/users/${ownerId}/profile-picture`}
                              alt={ownerId}
                            />
                            <AvatarFallback>{ownerId}</AvatarFallback>
                          </Avatar>
                        )
                      })}
                      <DialogTrigger>
                        <Avatar>
                          <AvatarFallback>+</AvatarFallback>
                        </Avatar>
                      </DialogTrigger>
                    </div>
                    <Button
                      onClick={() => {
                        if (!myId) return
                        if (orderItem.ownerIds.includes(myId))
                          handleRemoveOwner(orderItem.id, myId)
                        else handleAddOwner(orderItem.id, myId)
                      }}
                    >
                      {orderItem.ownerIds.includes(myId)
                        ? 'Exclude Me'
                        : 'Include Me'}
                    </Button>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share with</DialogTitle>
                        <DialogDescription>
                          Share this item with others
                        </DialogDescription>
                        {availableUserIds.map((userId) => {
                          const isOwner = orderItem.ownerIds.includes(userId)
                          return (
                            <Button
                              key={userId}
                              onClick={() => {
                                if (isOwner)
                                  handleRemoveOwner(orderItem.id, userId)
                                else handleAddOwner(orderItem.id, userId)
                              }}
                            >
                              <div>
                                <Avatar key={userId}>
                                  <AvatarImage
                                    src={`/users/${userId}/profile-picture`}
                                    alt={userId}
                                  />
                                  <AvatarFallback>{userId}</AvatarFallback>
                                </Avatar>
                                <span>{userId}</span>
                              </div>
                              <span>{isOwner ? 'Remove' : 'Add'}</span>
                            </Button>
                          )
                        })}
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  {orderItem.customizations?.size ? (
                    <ul>
                      {orderItem.customizations
                        .entries()
                        .map(([group, options]) => (
                          <li key={group}>
                            <strong>{group}</strong>
                            {options.size > 0 ? (
                              <ul>
                                {Array.from(options).map((option) => (
                                  <li key={option}>{option}</li>
                                ))}
                              </ul>
                            ) : (
                              <p>-</p>
                            )}
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <div>No customization</div>
                  )}
                  <div>
                    Subtotal:{' '}
                    {numberFormat.format(orderItem.quantity * menuItem.price)}
                  </div>

                  <ButtonGroup>
                    <Button
                      aria-label="Decrease quantity"
                      onClick={() => handleDecrement(orderItem.id)}
                    >
                      −
                    </Button>
                    <div>{orderItem.quantity}</div>
                    <Button
                      aria-label="Increase quantity"
                      onClick={() => handleIncrement(orderItem.id)}
                    >
                      +
                    </Button>
                  </ButtonGroup>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>No order yet</Empty>
          )}
          <Button onClick={handleAddToOrder} aria-label="Add to order">
            Add to Order
          </Button>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
