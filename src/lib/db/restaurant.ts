import { RestaurantId } from '../types'
import * as data from './data'

export async function getAllRestaurants() {
  return Array.from(data.restaurants.values())
}

export async function getRestaurant(restaurantId: RestaurantId) {
  return data.restaurants.get(restaurantId)
}

export async function getMenu(restaurantId: RestaurantId) {
  return data.restaurantMenu.get(restaurantId)
}
