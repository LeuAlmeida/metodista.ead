/**
 * Config.
 * @module config
 */

import { defaultWidget, widgetMapping } from './Widgets';
import {
  layoutViews,
  contentTypesViews,
  defaultView,
  errorViews,
} from './Views';
import { nonContentRoutes } from './NonContentRoutes';
import ToHTMLRenderers, {
  options as ToHTMLOptions,
} from './RichTextEditor/ToHTML';
import {
  extendedBlockRenderMap,
  blockStyleFn,
  listBlockTypes,
} from './RichTextEditor/Blocks';
import plugins, { inlineToolbarButtons } from './RichTextEditor/Plugins';
import FromHTMLCustomBlockFn from './RichTextEditor/FromHTML';
import {
  customTiles,
  defaultTilesViewMap,
  defaultTilesEditMap,
  messagesTiles,
} from './Tiles';

export const settings = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '3000',
  apiPath: process.env.RAZZLE_API_PATH || 'http://localhost:8080/Plone', // for Plone
  // apiPath: process.env.RAZZLE_API_PATH || 'http://localhost:8000', // for Volto reference
  // apiPath: process.env.RAZZLE_API_PATH || 'http://localhost:8081/db/web', // for guillotina
  websockets: process.env.RAZZLE_WEBSOCKETS || false,
  nonContentRoutes,
  extendedBlockRenderMap,
  blockStyleFn,
  listBlockTypes,
  FromHTMLCustomBlockFn,
  richTextEditorInlineToolbarButtons: inlineToolbarButtons,
  richTextEditorPlugins: plugins,
  ToHTMLRenderers,
  ToHTMLOptions,
};

export const widgets = {
  ...widgetMapping,
  default: defaultWidget,
};

export const views = {
  layoutViews,
  contentTypesViews,
  defaultView,
  errorViews,
};

export const tiles = {
  customTiles,
  defaultTilesViewMap,
  defaultTilesEditMap,
  messagesTiles,
};
