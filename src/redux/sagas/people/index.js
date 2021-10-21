import {
    apply,
    call,
    fork,
    put,
    select,
    take,
    takeEvery,
} from 'redux-saga/effects';
import { LOAD_USERS, LOAD_USERS_SUCCESS } from '../../reducers/people/actions';
import { LOCATION_CHANGE } from 'connected-react-router';

export function* loadPeopleDetails() {}

export function* loadPeopleList({ payload }) {
    const { page, search } = payload;
    const request = yield call(
        fetch,
        `https://swapi.dev/api/people?page=${page}&search=${search}`
    );
    const data = yield apply(request, request.json);

    yield put({
        type: LOAD_USERS_SUCCESS,
        payload: data,
    });
}

export function* loadUsersOnRouteEnter() {
    while (true) {
        const action = yield take(LOCATION_CHANGE);

        if (action.payload.location.pathname === '/') {
            const { page, search } = yield select((state) => state.people);

            yield put({
                type: LOAD_USERS,
                payload: { page, search },
            });
        }
    }
}

export default function* peopleSaga() {
    yield fork(loadUsersOnRouteEnter);
    yield takeEvery(LOAD_USERS, loadPeopleList);
}