import {
  CustomerId,
  GuestId,
  MenuItem,
  TmpOrderItem,
  TmpOrderItemId,
} from '@/lib/types'
import { useSelf } from '@liveblocks/react/suspense'
import Image from 'next/image'
import { useState } from 'react'

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
    <div>
      <MenuItemComponent menuItem={menuItem} />
      {orderItems ? (
        <li>
          {orderItems.map((orderItem) => {
            return (
              <div key={orderItem.id}>
                <div>{orderItem.id}</div>
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
                <QuantityMutator
                  quantity={orderItem.quantity}
                  handleDecrement={() => handleDecrement(orderItem.id)}
                  handleIncrement={() => handleIncrement(orderItem.id)}
                />
              </div>
            )
          })}
        </li>
      ) : (
        <AddToOrderButton handleAddToOrder={handleAddToOrder} />
      )}
    </div>
  )
}

function MenuItemComponent({ menuItem }: { menuItem: MenuItem }) {
  return (
    <div
      key={menuItem.id}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-4">
        <div className="flex gap-4">
          <div className="shrink-0">
            {menuItem.photoPathinfo && (
              <Image
                src={menuItem.photoPathinfo}
                alt={menuItem.name}
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-lg"
              />
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
      className="px-3 py-1 rounded-md bg-orange-500 text-white hover:bg-orange-600"
      onClick={handleAddToOrder}
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
    <>
      <button
        className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200"
        onClick={handleDecrement}
      >
        -
      </button>
      <span className="w-8 text-center">{quantity}</span>
      <button
        className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200"
        onClick={handleIncrement}
      >
        +
      </button>
    </>
  )
}

type OwnerId = CustomerId | GuestId

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
  const hasMe = ownerIds.includes(me.id)

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex items-center">
      {ownerIds.map((ownerId, index) => (
        <Image
          key={ownerId}
          src={`/user/${ownerId}/profile-picture`}
          alt={ownerId}
          title={ownerId}
          className={`w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm transition-transform duration-200 hover:scale-110 ${
            index !== 0 ? '-ml-3' : ''
          }`}
          style={{ zIndex: ownerIds.length - index }}
        />
      ))}
      <button
        onClick={() => setIsModalOpen(true)}
        className="-ml-3 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-300 transition-colors duration-200 shadow-sm"
      >
        +
      </button>
      <button
        className={`px-3 py-1 rounded-md text-sm ${
          hasMe
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
        }`}
        onClick={() =>
          hasMe ? handleAddOwner(me.id) : handleRemoveOwner(me.id)
        }
      >
        {hasMe ? 'Remove Me' : 'Include Me'}
      </button>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add a user</h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              {availableUserIds.map((userId) => (
                <button
                  key={userId}
                  onClick={() => handleAddOwner(userId)}
                  className="flex items-center w-full p-2 rounded-md hover:bg-gray-100 transition"
                >
                  <Image
                    src={`/user/${userId}/profile-picture`}
                    alt={userId}
                    title={userId}
                  />
                  <span className="text-gray-800">{userId}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
