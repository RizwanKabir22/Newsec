import { memo, type CSSProperties } from 'react';
import { ICONS, type IconName } from '../icons';

interface Props { name: IconName; size?: number; style?: CSSProperties }

/** Iconsax outline icon. `data-ic` is kept so the motion layer can find icons (arrow nudge, bell wiggle…). */
export const Icon = memo(function Icon({ name, size = 16, style }: Props) {
  return (
    <span data-ic={name} style={style}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />
    </span>
  );
});
