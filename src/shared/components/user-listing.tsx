import { Component } from 'inferno';
import { Link } from 'inferno-router';
import { UserSafe } from 'lemmy-js-client';
import { showAvatars, hostname, isCakeDay } from '../utils';
import { CakeDay } from './cake-day';
import { PictrsImage } from './pictrs-image';

interface UserListingProps {
  user: UserSafe;
  realLink?: boolean;
  useApubName?: boolean;
  muted?: boolean;
  hideAvatar?: boolean;
  showApubName?: boolean;
}

export class UserListing extends Component<UserListingProps, any> {
  constructor(props: any, context: any) {
    super(props, context);
  }

  render() {
    let user = this.props.user;
    let local = user.local == null ? true : user.local;
    let apubName: string, link: string;

    if (local) {
      apubName = `@${user.name}`;
      link = `/u/${user.name}`;
    } else {
      apubName = `@${user.name}@${hostname(user.actor_id)}`;
      link = !this.props.realLink ? `/user/${user.id}` : user.actor_id;
    }

    let displayName = this.props.useApubName
      ? apubName
      : user.preferred_username
      ? user.preferred_username
      : apubName;

    if (this.props.showApubName && !local && user.preferred_username) {
      displayName = `${displayName} (${apubName})`;
    }

    return (
      <>
        <Link
          title={apubName}
          className={this.props.muted ? 'text-muted' : 'text-info'}
          to={link}
        >
          {!this.props.hideAvatar && user.avatar && showAvatars() && (
            <PictrsImage src={user.avatar} icon />
          )}
          <span>{displayName}</span>
        </Link>

        {isCakeDay(user.published) && <CakeDay creatorName={apubName} />}
      </>
    );
  }
}
