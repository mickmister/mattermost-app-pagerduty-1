import axios, {AxiosResponse} from 'axios';
import {
    Channel, DialogProps,
    PostCreate,
    PostEphemeralCreate,
    PostResponse,
    PostUpdate,
    User
} from '../types';
import {Routes} from '../constant';
import {replace} from '../utils/utils';

export interface MattermostOptions {
    mattermostUrl: string;
    accessToken: string | null | undefined;
}

export class MattermostClient {
    private readonly config: MattermostOptions;

    constructor(
        config: MattermostOptions
    ) {
        this.config = config;
    }

    public createPost(post: PostCreate): Promise<PostResponse> {
        const url: string = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.PostsPath}`;
        return axios.post(url, post, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`
            }
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public createEphemeralPost(post: PostEphemeralCreate): Promise<PostResponse> {
        const url: string = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.PostsEphemeralPath}`;
        return axios.post(url, post, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`
            }
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public getPost(postId: string): Promise<PostResponse> {
        const url: string = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.PostPath}`;
        return axios.get(replace(url, Routes.PathsVariable.Identifier, postId), {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`
            }
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public updatePost(postId: string, post: PostUpdate): Promise<any> {
        const url: string = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.PostPath}`;
        return axios.put(replace(url, Routes.PathsVariable.Identifier, postId), post, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`
            }
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public deletePost(postId: string): Promise<any> {
        const url: string = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.PostPath}`;
        return axios.delete(replace(url, Routes.PathsVariable.Identifier, postId), {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`
            }
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public getUser(userId: string): Promise<User> {
        const url: string = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.UserPath}`;
        return axios.get(replace(url, Routes.PathsVariable.Identifier, userId), {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`
            }
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public getChannel(channelId: string): Promise<Channel> {
        const url: string = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.ChannelPath}`;
        return axios.get(replace(url, Routes.PathsVariable.Identifier, channelId), {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`
            }
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public showDialog(dialog: DialogProps): Promise<any> {
        const url: string = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.DialogsOpenPath}`;
        return axios.post(url, dialog, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`
            }
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public createDirectChannel(ids: string[]): Promise<any> {
        const url: string = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.ChannelDirectPath}`;
        return axios.post(url, ids, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`
            }
        }).then((response: AxiosResponse<any>) => response.data);
    }
}
