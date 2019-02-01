import React, { ComponentType, FunctionComponent, ReactNode } from "react";
import cn from "classnames";
import { Omit } from "@react-md/utils";

import RippleContainer from "./RippleContainer";
import { useRipplesState, usePressedStates } from "./hooks";
import { IRipplesOptions, IWithRipples } from "./types.d";

/**
 * A higher order component for adding ripples to a component. No idea if
 * this is close to being typed correctly...
 */
export default function withRipples<P extends IWithRipples = IWithRipples>(
  Component: ComponentType<P>
) {
  const WithRipples: FunctionComponent<
    Omit<P, "ripples"> & IRipplesOptions
  > = providedProps => {
    const {
      disableRipple,
      disableProgrammaticRipple,
      rippleClassName,
      rippleContainerClassName,
      ...props
    } = providedProps as any; // doesn't seem to work with types with anything other than any
    const {
      ripples,
      setRipples,
      eventHandlers,
      disableRipple: isRippleDisabled,
    } = useRipplesState(providedProps);

    if (!isRippleDisabled) {
      const container: ReactNode = (
        <RippleContainer
          ripples={ripples}
          setRipples={setRipples}
          className={rippleContainerClassName}
          rippleClassName={rippleClassName}
        />
      );

      return <Component {...props} {...eventHandlers} ripples={container} />;
    }

    const { pressed, eventHandlers: handlers } = usePressedStates(
      providedProps
    );
    return (
      <Component
        {...props}
        {...handlers}
        ripples={null}
        className={cn(props.className, {
          "rmd-states--pressed": pressed,
        })}
      />
    );
  };

  if (process.env.NODE_ENV !== "production") {
    WithRipples.displayName = `withRipples(${Component.displayName})`;
  }

  return WithRipples;
}