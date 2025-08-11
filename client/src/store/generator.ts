import {
  createAction,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntitySelectors,
  EntityState,
} from '@reduxjs/toolkit';
import config from 'config';
import querystring from 'querystring';
import {
  DefaultSliceActionsConfig,
  SliceActionsConfig,
  SliceSelectors,
  SliceState,
} from './types';

const SERVER_API_ENDPOINT = config.get('SERVER_API_ENDPOINT', '/api');

const parseIds = <T extends Record<keyof T, any>>(data: T) => {
  const idKeys = Object.keys(data).filter((key) => key.endsWith('Id'));
  idKeys.forEach((key) => {
    data[key] = parseInt(data[key]);
  });
  return data;
};

const generator = <
  S,
  T,
  C extends SliceActionsConfig = DefaultSliceActionsConfig
>(
  name: string,
  sortComparer: (a: T, b: T) => number,
) => {
  const getList = createAsyncThunk<T[], C['getList']>(
    `getList/${name}`,
    async (payload = {}) => {
      const { params } = payload;
      const response = await fetch(
        `${SERVER_API_ENDPOINT}/${name}${
          params ? '?' + querystring.stringify(params) : ''
        }`,
      ).then((res) => res.json());
      console.log(response);
      return response;
    },
  );

  const create = createAsyncThunk<T, C['create']>(
    `create/${name}`,
    async (payload = {}) => {
      const { item, params } = payload;
      const response = await fetch(
        `${SERVER_API_ENDPOINT}/${name}${
          params ? '?' + querystring.stringify(params) : ''
        }`,
        {
          headers: {
            'content-type': 'application/json',
          },
          method: 'post',
          body: JSON.stringify(item),
        },
      ).then((res) => res.json());
      return response;
    },
  );

  const reset = createAction<void>(`reset/${name}`);

  const adapter = createEntityAdapter<T>(sortComparer ? { sortComparer } : {});
  const defaultSelectors = adapter.getSelectors();
  const enhancedSelectors = Object.keys(defaultSelectors).reduce(
    (
      selectors: SliceSelectors<T>,
      selector: keyof EntitySelectors<T, EntityState<T>>,
    ) => ({
      ...selectors,
      [selector]: (state: S, id?: string) =>
        defaultSelectors[selector](state[name], id),
    }),
    {} as SliceSelectors<T>,
  );
  enhancedSelectors.selectError = (state) => state[name].error;
  enhancedSelectors.selectLoading = (state) => state[name].loading;

  const slice = createSlice<SliceState<T>, Record<string, never>>({
    name,
    initialState: adapter.getInitialState({
      loading: false,
      error: null,
    }),
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(reset, (state) => {
        adapter.removeAll(state as SliceState<T>);
        state.loading = false;
        state.error = null;
      });
      builder.addCase(getList.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(getList.fulfilled, (state, action) => {
        adapter.setAll(state as SliceState<T>, action.payload);
        state.loading = false;
      });
      builder.addCase(getList.rejected, (state, action) => {
        state.error = action.error;
        state.loading = false;
      });

      builder.addCase(create.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(create.fulfilled, (state, action) => {
        adapter.addOne(state as SliceState<T>, action.payload);
        state.loading = false;
      });
      builder.addCase(create.rejected, (state, action) => {
        state.error = action.error;
        state.loading = false;
      });
    },
  });

  return {
    ...slice,
    selectors: enhancedSelectors,
    actions: {
      reset,
      getList,
      create,
    },
  };
};

export default generator;
