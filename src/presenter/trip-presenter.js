import { render, RenderPosition, remove } from '../framework/render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EventListSortingView from '../view/event-list-sorting-view.js';
import EmptyListView from '../view/empty-list-view.js';
import TripEventPresenter from './trip-event-presenter.js';
import { sortDays, sortPrices } from '../utils.js';
import { SORT_TYPE, UPDATE_TYPE, USER_ACTION } from '../const.js';

class TripPresenter {
  #tripEventsList = new TripEventsListView();
  #emptyListComponent = new EmptyListView('Everything');
  #eventSorter = null;
  #tripEventPresenter = new Map();
  #container;
  #tripEventsModel;

  #currentSortType = SORT_TYPE.DAY;

  constructor (container, tripEventsModel) {
    this.#container = container;
    this.#tripEventsModel = tripEventsModel;

    this.#tripEventsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard();
  }

  get events() {
    switch (this.#currentSortType) {
      case SORT_TYPE.DAY:
        return [...this.#tripEventsModel.events].sort(sortDays);
      case SORT_TYPE.PRICE:
        return [...this.#tripEventsModel.events].sort(sortPrices);
    }

    return this.#tripEventsModel.events;
  }

  #renderEventList = () => {
    render(this.#tripEventsList, this.#container);
    this.#renderEvents();
  };

  #renderEmptyList = () => {
    render(this.#emptyListComponent, this.#container);
  };

  #renderEvent = (task) => {
    const tripEventPresenter = new TripEventPresenter(this.#tripEventsList, this.#handleViewAction, this.#handleModeChange);
    tripEventPresenter.init(task);
    this.#tripEventPresenter.set(task.id, tripEventPresenter);
  };

  #renderEvents = () => {
    this.events.forEach((task) => this.#renderEvent(task));
  };

  #clearEventList = ({resetSortType = false} = {}) => {
    this.#tripEventPresenter.forEach((presenter) => presenter.destroy());
    this.#tripEventPresenter.clear();

    remove(this.#eventSorter);
    remove(this.#emptyListComponent);

    if (resetSortType) {
      this.#currentSortType = SORT_TYPE.DAY;
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case USER_ACTION.UPDATE_TASK:
        this.#tripEventsModel.updateTask(updateType, update);
        break;
      case USER_ACTION.ADD_TASK:
        this.#tripEventsModel.addTask(updateType, update);
        break;
      case USER_ACTION.DELETE_TASK:
        this.#tripEventsModel.deleteTask(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this.#tripEventPresenter.get(data.id).init(data);
        break;
      case UPDATE_TYPE.MINOR:
        this.#clearEventList();
        this.#renderBoard();
        break;
      case UPDATE_TYPE.MAJOR:
        this.#clearEventList({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#tripEventPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderSort = () => {
    this.#eventSorter = new EventListSortingView(this.#currentSortType);
    this.#eventSorter.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#eventSorter, this.#container, RenderPosition.AFTERBEGIN);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearEventList();
    this.#renderBoard();
  };

  #renderBoard = () => {
    const events = this.events;
    const eventCount = events.length;
    if (eventCount === 0) {
      this.#renderEmptyList();
      return;
    }
    this.#renderSort();
    this.#renderEventList();
  };
}

export default TripPresenter;
