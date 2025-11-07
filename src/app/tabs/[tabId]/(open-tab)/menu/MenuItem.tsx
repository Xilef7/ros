import { OwnerId, MenuItem, TmpOrderItem, TmpOrderItemId } from '@/lib/types'
import { useSelf } from '@liveblocks/react/suspense'
import Image from 'next/image'
import { useState } from 'react'
import { Avatar } from '../Avatar'

export default function OrderableMenuItem({
  menuItem,
  orderItems,
  handleAddToOrder,
  handleIncrement,
  handleDecrement,
  availableUserIds,
  handleAddOwner,
  handleRemoveOwner,
}: {
  menuItem: MenuItem
  orderItems: TmpOrderItem[]
  handleAddToOrder: () => void
  handleIncrement: (orderItemId: TmpOrderItemId) => void
  handleDecrement: (orderItemId: TmpOrderItemId) => void
  availableUserIds: OwnerId[]
  handleAddOwner: (orderItemId: TmpOrderItemId, ownerId: OwnerId) => void
  handleRemoveOwner: (orderItemId: TmpOrderItemId, ownerId: OwnerId) => void
}) {
  return (
    <div className="space-y-3">
      <MenuItemComponent
        menuItem={menuItem}
        orderItems={orderItems}
        handleAddToOrder={handleAddToOrder}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        availableUserIds={availableUserIds}
        handleAddOwner={handleAddOwner}
        handleRemoveOwner={handleRemoveOwner}
      />
    </div>
  )
}

function MenuItemComponent({
  menuItem,
  orderItems,
  handleAddToOrder,
  handleIncrement,
  handleDecrement,
  availableUserIds,
  handleAddOwner,
  handleRemoveOwner,
}: {
  menuItem: MenuItem
  orderItems: TmpOrderItem[]
  handleAddToOrder: () => void
  handleIncrement: (orderItemId: TmpOrderItemId) => void
  handleDecrement: (orderItemId: TmpOrderItemId) => void
  availableUserIds: OwnerId[]
  handleAddOwner: (orderItemId: TmpOrderItemId, ownerId: OwnerId) => void
  handleRemoveOwner: (orderItemId: TmpOrderItemId, ownerId: OwnerId) => void
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex gap-4">
          <div className="shrink-0">
            {menuItem.photoPathinfo ? (
              <Image
                src={menuItem.photoPathinfo}
                alt={menuItem.name}
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                No photo
              </div>
            )}
          </div>

          <div className="grow">
            <h3 className="text-lg font-semibold text-gray-800">
              {menuItem.name}
            </h3>
            {menuItem.description && (
              <p className="text-gray-600 text-sm mt-1">
                {menuItem.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-orange-600 font-medium">
                Rp {menuItem.price.toLocaleString('id-ID')}
              </span>
              <span className="text-sm text-gray-500">
                ({menuItem.portionSize})
              </span>
            </div>
          </div>
        </div>

        {/* Add to order always visible and grouped inside the menu card */}
        <div className="mt-4 flex items-center justify-between">
          <AddToOrderButton handleAddToOrder={handleAddToOrder} />
          <span className="text-sm text-gray-500">
            Rp {menuItem.price.toLocaleString('id-ID')}
          </span>
        </div>

        {/* Order entries: only render when there are entries */}
        {orderItems && orderItems.length > 0 && (
          <div className="mt-4">
            <OrderItemsAccordion defaultOpen>
              <ul className="space-y-3">
                {orderItems.map((orderItem) => (
                  <li
                    key={orderItem.id}
                    className="bg-gray-50 rounded-lg p-3 shadow-sm"
                  >
                    {/* Avatar stack + Include/Exclude Me on top */}
                    <div className="flex items-center justify-between mb-3">
                      <OwnerStack
                        availableUserIds={availableUserIds}
                        ownerIds={orderItem.ownerIds}
                        handleAddOwner={(ownerId: OwnerId) =>
                          handleAddOwner(orderItem.id, ownerId)
                        }
                        handleRemoveOwner={(ownerId: OwnerId) =>
                          handleRemoveOwner(orderItem.id, ownerId)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-700 font-medium">
                          Entry #{orderItem.id}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Subtotal: Rp{' '}
                          {(orderItem.quantity * menuItem.price).toLocaleString(
                            'id-ID',
                          )}
                        </div>
                      </div>

                      <QuantityMutator
                        quantity={orderItem.quantity}
                        handleDecrement={() => handleDecrement(orderItem.id)}
                        handleIncrement={() => handleIncrement(orderItem.id)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </OrderItemsAccordion>
          </div>
        )}
      </div>
    </div>
  )
}

function AddToOrderButton({
  handleAddToOrder,
}: {
  handleAddToOrder: () => void
}) {
  return (
    <button
      className="px-3 py-1 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition"
      onClick={handleAddToOrder}
      aria-label="Add to order"
    >
      Add to Order
    </button>
  )
}

function QuantityMutator({
  quantity,
  handleIncrement,
  handleDecrement,
}: {
  quantity: number
  handleIncrement: () => void
  handleDecrement: () => void
}) {
  return (
    <div className="inline-flex items-center rounded-full overflow-hidden border border-gray-200">
      <button
        aria-label="Decrease quantity"
        className="px-3 py-1 bg-orange-50 text-orange-600 hover:bg-orange-100"
        onClick={handleDecrement}
      >
        −
      </button>
      <div className="px-4 text-sm w-12 text-center">{quantity}</div>
      <button
        aria-label="Increase quantity"
        className="px-3 py-1 bg-orange-50 text-orange-600 hover:bg-orange-100"
        onClick={handleIncrement}
      >
        +
      </button>
    </div>
  )
}

function OrderItemsAccordion({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen)
  return (
    <div className="border rounded-md bg-white">
      <button
        className="w-full flex items-center justify-between px-4 py-2 text-left"
        onClick={() => setIsOpen((s) => !s)}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-700">Order entries</span>
        <span className="text-sm text-gray-500">
          {isOpen ? 'Hide' : 'Show'}
        </span>
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  )
}

function OwnerStack({
  availableUserIds,
  ownerIds,
  handleAddOwner,
  handleRemoveOwner,
}: {
  availableUserIds: OwnerId[]
  ownerIds: OwnerId[]
  handleAddOwner: (ownerId: OwnerId) => void
  handleRemoveOwner: (ownerId: OwnerId) => void
}) {
  const me = useSelf()
  const myId = (me?.id || undefined) as OwnerId | undefined
  const hasMe = myId ? ownerIds.includes(myId) : false

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex items-center gap-3">
      {/* Avatar stack */}
      <div className="flex -space-x-3 items-center">
        {ownerIds.map((ownerId, index) => (
          <div
            key={ownerId}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm"
            style={{ zIndex: ownerIds.length - index }}
            title={String(ownerId)}
          >
            <Avatar name={ownerId} />
          </div>
        ))}
      </div>

      {/* (+) button to manage other owners */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 hover:bg-gray-300 transition-shadow"
        aria-label="Manage owners"
      >
        +
      </button>

      {/* Include / Exclude me */}
      <button
        className={`px-3 py-1 rounded-md text-sm ${
          hasMe
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
        }`}
        onClick={() => {
          if (!myId) return
          if (hasMe) handleRemoveOwner(myId)
          else handleAddOwner(myId)
        }}
      >
        {hasMe ? 'Exclude Me' : 'Include Me'}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Manage owners</h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              {availableUserIds.map((userId) => {
                const isOwner = ownerIds.includes(userId)
                return (
                  <button
                    key={userId}
                    onClick={() => {
                      if (isOwner) handleRemoveOwner(userId)
                      else handleAddOwner(userId)
                    }}
                    className="flex items-center w-full p-2 rounded-md hover:bg-gray-100 transition justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Avatar name={userId} />
                      </div>
                      <span className="text-gray-800">{String(userId)}</span>
                    </div>
                    <span
                      className={`text-sm ${
                        isOwner ? 'text-red-600' : 'text-orange-600'
                      }`}
                    >
                      {isOwner ? 'Remove' : 'Add'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
