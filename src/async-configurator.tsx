import dynamic from 'next/dynamic';
import type {ConfiguratorProps} from './configurator'

export const AsyncConfigurator = dynamic<ConfiguratorProps>(() => import('./configurator').then(mod => mod.Configurator));

