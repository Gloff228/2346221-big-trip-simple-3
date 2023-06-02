import { getRandomArrayElement, getRandomInt } from '../utils.js';
import { DESTINATION_NAMES, TRIP_POINT_TYPES } from '../const.js';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

const generateRandomPointType = () => getRandomArrayElement(TRIP_POINT_TYPES);

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  return getRandomArrayElement(descriptions);
};

const generatePhotos = () => {
  const picturesNumber = getRandomInt(1, 5);
  const pictures = new Array(picturesNumber);
  for (let i = 0; i < pictures.length; ++i) {
    pictures[i] = {
      src: `http://picsum.photos/248/152?r=${getRandomInt(0, 100)}`,
      description: generateDescription(),
    };
  }
  return pictures;
};

const generateRandomDates = () => {
  const date = dayjs();

  const minutesOffset = getRandomInt(-12 * 60, 12 * 60);
  const minutesDuration = getRandomInt(10, 60);

  const dateFrom = date.add(minutesOffset, 'minute');
  const dateTo = dateFrom.add(minutesDuration, 'minute');
  return {
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
  };
};

const DESTINATIONS = {};
DESTINATION_NAMES.forEach((name, index) => {
  const id = index + 1;
  DESTINATIONS[`${id}`] = {
    id,
    description: generateDescription(),
    name,
    pictures: generatePhotos(),
  };
});

const generateOffers = () => {
  const offers = {};
  const offersNumber = getRandomInt(0, 5);
  for (let id = 1; id <= offersNumber; ++id) {
    offers[`${id}`] = {
      id,
      title: `Offer ${id}`,
      price: getRandomInt(1, 100),
    };
  }
  return offers;
};

const OFFERS_BY_TYPE = {};
TRIP_POINT_TYPES.forEach((name) => {
  OFFERS_BY_TYPE[`${name}`] = {
    'type': name,
    'offers': generateOffers(),
  };
});

const generateOffersIds = (type) => {
  const offersIds = new Array();
  const offersMaxNumber = Object.keys(OFFERS_BY_TYPE[`${type}`].offers).length;
  for (let i = 1; i <= offersMaxNumber; ++i) {
    if (getRandomInt(0, 1)){
      offersIds.push(i);
    }
  }
  return offersIds;
};

const getRandomDestination = () => DESTINATIONS[`${getRandomInt(1, DESTINATION_NAMES.length)}`];

const generateTripPoints = (pointsCount) => {
  const points = new Array(pointsCount);
  for (let i = 0; i < pointsCount; ++i) {
    const { dateFrom, dateTo } = generateRandomDates();
    const type = generateRandomPointType();
    points[i] = {
      id: nanoid(),
      type,
      dateFrom,
      dateTo,
      basePrice: getRandomInt(1, 1000),
      offers: generateOffersIds(type),
      destination: getRandomDestination(),
    };
  }
  return points;
};

export { generateTripPoints, OFFERS_BY_TYPE, DESTINATION_NAMES, DESTINATIONS };