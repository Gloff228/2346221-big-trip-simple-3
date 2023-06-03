import {remove, render, RenderPosition} from '../framework/render.js';
import {USER_ACTION, UPDATE_TYPE} from '../const.js';
import PointEditFormView from '../view/point-edit-form-view.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #changeData = null;
  #newPointForm = null;
  #destroyCallback = null;
  #availableDestinations = null;
  #availableOffers = null;

  constructor(pointListContainer, changeData) {

    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (callback, destinations = null, offers = null) => {
    this.#availableDestinations = destinations;
    this.#availableOffers = offers;

    this.#destroyCallback = callback;

    if (this.#newPointForm !== null) {
      return;
    }

    this.#newPointForm = new PointEditFormView(this.#availableDestinations, this.#availableOffers);
    this.#newPointForm.setFormSubmitListener(this.#handleFormSubmit);
    this.#newPointForm.setDeleteButtonClickListener(this.#handleDeleteClick);

    render(this.#newPointForm, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#newPointForm === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#newPointForm);
    this.#newPointForm = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#newPointForm.updateElement({
      isSaving: true,
    });
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      USER_ACTION.ADD_TASK,
      UPDATE_TYPE.MINOR,
      point,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
